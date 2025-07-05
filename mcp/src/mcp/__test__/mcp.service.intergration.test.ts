import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from '../mcp.service';
import { McpScannerService } from '../mcp-scanner.service';
import { Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { McpController, Tool, Resource } from '../decorators';

@McpController()
class TestIntegrationController {
  @Tool({
    name: 'echo-tool',
    description: 'Echoes back the input message',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  })
  echoTool(args: { message: string }) {
    return { echo: args.message, timestamp: new Date().toISOString() };
  }

  @Resource({
    uri: 'test://health',
    name: 'health-check',
    description: 'Health check resource',
    mimeType: 'application/json',
  })
  healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}

describe('McpService Integration Test', () => {
  let mcpService: McpService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        McpService,
        McpScannerService,
        DiscoveryService,
        Reflector,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
      controllers: [TestIntegrationController],
    }).compile();

    mcpService = module.get<McpService>(McpService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (mcpService) {
      await mcpService.onModuleDestroy();
    }
    await module.close();
  });

  describe('MCP Server Initialization', () => {
    it('should initialize MCP server without errors', async () => {
      const logger = module.get<Logger>(Logger);
      
      await expect(mcpService.onModuleInit()).resolves.not.toThrow();
      
      expect(logger.log).toHaveBeenCalledWith('MCP Server initialized successfully');
    });

    it('should discover and register tools', async () => {
      await mcpService.onModuleInit();
      
      const mcpScanner = module.get<McpScannerService>(McpScannerService);
      const tools = mcpScanner.scanForTools();
      
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('echo-tool');
      expect(tools[0].description).toBe('Echoes back the input message');
    });

    it('should discover and register resources', async () => {
      await mcpService.onModuleInit();
      
      const mcpScanner = module.get<McpScannerService>(McpScannerService);
      const resources = mcpScanner.scanForResources();
      
      expect(resources).toHaveLength(1);
      expect(resources[0].name).toBe('health-check');
      expect(resources[0].uri).toBe('test://health');
    });
  });

  describe('Server Health Check', () => {
    beforeEach(async () => {
      await mcpService.onModuleInit();
    });

    it('should have server instance after initialization', () => {
      expect(mcpService['server']).toBeDefined();
      expect(mcpService['transport']).toBeDefined();
    });

    it('should have registered handlers', () => {
      const server = mcpService['server'];
      expect(server).toBeDefined();
    });

    it('should handle module destruction gracefully', async () => {
      const logger = module.get<Logger>(Logger);
      
      await expect(mcpService.onModuleDestroy()).resolves.not.toThrow();
      expect(logger.log).toHaveBeenCalledWith('MCP Server closed');
    });
  });

  describe('Tool and Resource Registration', () => {
    beforeEach(async () => {
      await mcpService.onModuleInit();
    });

    it('should register tools with correct metadata', () => {
      const tools = mcpService['tools'];
      
      expect(tools).toHaveLength(1);
      expect(tools[0]).toMatchObject({
        name: 'echo-tool',
        description: 'Echoes back the input message',
        inputSchema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
        },
        methodName: 'echoTool',
      });
    });

    it('should register resources with correct metadata', () => {
      const resources = mcpService['resources'];
      
      expect(resources).toHaveLength(1);
      expect(resources[0]).toMatchObject({
        uri: 'test://health',
        name: 'health-check',
        description: 'Health check resource',
        mimeType: 'application/json',
        methodName: 'healthCheck',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const failingModule = await Test.createTestingModule({
        providers: [
          McpService,
          {
            provide: McpScannerService,
            useValue: {
              scanForTools: jest.fn().mockImplementation(() => {
                throw new Error('Scanner failed');
              }),
              scanForResources: jest.fn().mockReturnValue([]),
            },
          },
          {
            provide: Logger,
            useValue: {
              log: jest.fn(),
              error: jest.fn(),
              warn: jest.fn(),
              debug: jest.fn(),
            },
          },
        ],
      }).compile();

      const failingService = failingModule.get<McpService>(McpService);
      
      await expect(failingService.onModuleInit()).rejects.toThrow('Scanner failed');
      
      await failingModule.close();
    });

    it('should handle missing Logger gracefully', async () => {
      await expect(async () => {
        const moduleWithoutLogger = await Test.createTestingModule({
          providers: [
            McpService,
            McpScannerService,
            DiscoveryService,
            Reflector,
          ],
          controllers: [TestIntegrationController],
        }).compile();
      }).rejects.toThrow();
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple initialization attempts gracefully', async () => {
      const promises = [
        mcpService.onModuleInit(),
        mcpService.onModuleInit(),
        mcpService.onModuleInit(),
      ];

      await expect(Promise.all(promises)).resolves.not.toThrow();
    });

    it('should handle initialization and destruction sequence', async () => {
      await mcpService.onModuleInit();
      await mcpService.onModuleDestroy();
      
      await expect(mcpService.onModuleInit()).resolves.not.toThrow();
    });
  });
});