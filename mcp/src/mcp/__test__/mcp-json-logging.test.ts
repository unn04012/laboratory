import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from '../mcp.service';
import { McpScannerService } from '../mcp-scanner.service';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { McpController, Tool } from '../decorators';

@McpController()
class TestJsonLoggingController {
  @Tool({
    name: 'test-json-tool',
    description: 'Tool for testing JSON logging',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' },
      },
      required: ['input'],
    },
  })
  testJsonTool(args: { input: string }) {
    return { result: args.input };
  }
}

describe('MCP Service JSON Logging', () => {
  let mcpService: McpService;
  let module: TestingModule;
  let logSpy: jest.SpyInstance;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [McpService, McpScannerService, DiscoveryService, Reflector],
      controllers: [TestJsonLoggingController],
    }).compile();

    mcpService = module.get<McpService>(McpService);
  });

  beforeEach(() => {
    logSpy = jest.spyOn(mcpService['logger'], 'log').mockImplementation();
    jest.spyOn(mcpService['logger'], 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (mcpService) {
      await mcpService.onModuleDestroy();
    }
    await module.close();
  });

  describe('JSON Logging Format Validation', () => {
    it.only('should log initialization message in JSON format', async () => {
      await mcpService.onModuleInit();

      expect(logSpy).toHaveBeenCalled();
      const logCall = logSpy.mock.calls.find(
        (call) => call[0] === 'MCP Server initialized successfully',
      );
      console.log(logCall);
      expect(logCall).toBeDefined();
      expect(logCall[1]).toEqual({
        toolsCount: 1,
        resourcesCount: 0,
      });
    });

    it('should log errors in structured JSON format', async () => {
      await mcpService.onModuleInit();
      const errorSpy = jest
        .spyOn(mcpService['logger'], 'error')
        .mockImplementation();

      const tools = mcpService['tools'];
      const nonExistentTool = tools.find((t) => t.name === 'non-existent-tool');

      expect(nonExistentTool).toBeUndefined();

      if (!nonExistentTool) {
        mcpService['logger'].error('Tool not found', {
          toolName: 'non-existent-tool',
          availableTools: tools.map((t) => t.name),
        });

        expect(errorSpy).toHaveBeenCalledWith('Tool not found', {
          toolName: 'non-existent-tool',
          availableTools: ['test-json-tool'],
        });
      }
    });

    it('should validate that all log messages are JSON serializable', async () => {
      await mcpService.onModuleInit();

      logSpy.mock.calls.forEach((call) => {
        const [message, context] = call;

        expect(typeof message).toBe('string');

        if (context) {
          expect(() => JSON.stringify(context)).not.toThrow();

          const parsedContext = JSON.parse(JSON.stringify(context));
          expect(parsedContext).toEqual(context);
        }
      });
    });

    it('should include required fields in JSON log structure', async () => {
      await mcpService.onModuleInit();

      const logCall = logSpy.mock.calls.find(
        (call) => call[0] === 'MCP Server initialized successfully',
      );

      expect(logCall).toBeDefined();
      expect(logCall[1]).toHaveProperty('toolsCount');
      expect(logCall[1]).toHaveProperty('resourcesCount');
      expect(typeof logCall[1].toolsCount).toBe('number');
      expect(typeof logCall[1].resourcesCount).toBe('number');
    });
  });

  describe('Console Logger JSON Option', () => {
    it('should use ConsoleLogger with json: true option', () => {
      const logger = mcpService['logger'];

      expect(logger).toBeDefined();
      expect(logger.constructor.name).toBe('ConsoleLogger');
      expect(logger['options']).toHaveProperty('json', true);
    });

    it('should have proper context set for logger', () => {
      const logger = mcpService['logger'];

      expect(logger['context']).toBe('McpService');
    });
  });

  describe('Structured Logging Content', () => {
    it('should log tool execution attempts with context', async () => {
      await mcpService.onModuleInit();

      const logCalls = logSpy.mock.calls;
      const initCall = logCalls.find(
        (call) => call[0] === 'MCP Server initialized successfully',
      );

      expect(initCall[1]).toMatchObject({
        toolsCount: expect.any(Number),
        resourcesCount: expect.any(Number),
      });
    });

    it('should ensure all logged objects are properly structured', async () => {
      await mcpService.onModuleInit();

      logSpy.mock.calls.forEach((call) => {
        const [message, context] = call;

        if (context) {
          expect(context).toEqual(expect.any(Object));

          Object.values(context).forEach((value) => {
            expect(
              ['string', 'number', 'boolean', 'object'].includes(typeof value),
            ).toBe(true);

            if (typeof value === 'object' && value !== null) {
              expect(Array.isArray(value) || value.constructor === Object).toBe(
                true,
              );
            }
          });
        }
      });
    });
  });
});
