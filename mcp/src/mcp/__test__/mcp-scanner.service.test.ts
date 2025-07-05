import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { McpScannerService } from '../mcp-scanner.service';
import { McpController, Tool, Resource } from '../decorators';
import { MCP_CONTROLLER_METADATA } from '../constants/mcp.constants';
import { Controller } from '@nestjs/common';

// Mock MCP Controller for testing
@Controller()
@McpController()
class TestMcpController {
  @Tool({
    name: 'test-tool',
    description: 'A test tool',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' },
      },
      required: ['input'],
    },
  })
  testTool(input: string) {
    return `Processed: ${input}`;
  }

  @Resource({
    uri: 'test://resource',
    name: 'test-resource',
    description: 'A test resource',
    mimeType: 'application/json',
  })
  testResource() {
    return { data: 'test' };
  }
}

// Regular controller (should not be scanned)
class RegularController {
  regularMethod() {
    return 'regular';
  }
}

describe('McpScannerService', () => {
  let service: McpScannerService;
  let discoveryService: DiscoveryService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McpScannerService, DiscoveryService, Reflector],
      controllers: [TestMcpController],
    }).compile();

    service = module.get<McpScannerService>(McpScannerService);
    discoveryService = module.get<DiscoveryService>(DiscoveryService);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('scanForTools', () => {
    it('should scan and return MCP tools', () => {
      const testController = new TestMcpController();

      const tools = service.scanForTools();

      expect(tools).toHaveLength(1);
      expect(tools[0]).toEqual({
        name: 'test-tool',
        description: 'A test tool',
        inputSchema: {
          type: 'object',
          properties: {
            input: { type: 'string' },
          },
          required: ['input'],
        },
        methodName: 'testTool',
        target: testController,
      });
    });

    it('should return empty array when no MCP tools found', () => {
      jest.spyOn(discoveryService, 'getControllers').mockReturnValue([]);
      jest.spyOn(reflector, 'get').mockReturnValue(false);

      const tools = service.scanForTools();

      expect(tools).toEqual([]);
    });

    it('should handle controllers without instances', () => {
      const mockWrapper = {
        instance: null,
        metatype: TestMcpController,
      };

      jest
        .spyOn(discoveryService, 'getControllers')
        .mockReturnValue([mockWrapper as any]);
      jest.spyOn(reflector, 'get').mockReturnValue(true);

      const tools = service.scanForTools();

      expect(tools).toEqual([]);
    });
  });

  describe('scanForResources', () => {
    it('should scan and return MCP resources', () => {
      const testController = new TestMcpController();
      const resources = service.scanForResources();

      expect(resources).toHaveLength(1);
      expect(resources[0]).toEqual({
        uri: 'test://resource',
        name: 'test-resource',
        description: 'A test resource',
        mimeType: 'application/json',
        methodName: 'testResource',
        target: testController,
      });
    });

    it('should return empty array when no MCP resources found', () => {
      jest.spyOn(discoveryService, 'getControllers').mockReturnValue([]);
      jest.spyOn(reflector, 'get').mockReturnValue(false);

      const resources = service.scanForResources();

      expect(resources).toEqual([]);
    });
  });

  describe('getMcpControllers (private method behavior)', () => {
    it('should filter out non-MCP controllers', () => {
      const testController = new TestMcpController();
      const regularController = new RegularController();

      const mockWrappers: any = [
        {
          instance: testController,
          metatype: TestMcpController,
        },
        {
          instance: regularController,
          metatype: RegularController,
        },
      ];

      jest
        .spyOn(discoveryService, 'getControllers')
        .mockReturnValue(mockWrappers);

      jest.spyOn(reflector, 'get').mockImplementation((key, target) => {
        if (key === MCP_CONTROLLER_METADATA && target === TestMcpController) {
          return true;
        }
        return false;
      });

      const tools = service.scanForTools();
      const resources = service.scanForResources();

      // Verify that only MCP controllers are processed
      expect(reflector.get).toHaveBeenCalledWith(
        MCP_CONTROLLER_METADATA,
        TestMcpController,
      );
      expect(reflector.get).toHaveBeenCalledWith(
        MCP_CONTROLLER_METADATA,
        RegularController,
      );

      // Results should be empty since we didn't mock tool/resource metadata
      expect(tools).toEqual([]);
      expect(resources).toEqual([]);
    });

    it('should handle controllers without metatype', () => {
      const mockWrappers: any = [
        {
          instance: new TestMcpController(),
          metatype: null,
        },
      ];

      jest
        .spyOn(discoveryService, 'getControllers')
        .mockReturnValue(mockWrappers);
      jest.spyOn(reflector, 'get').mockReturnValue(false);

      const tools = service.scanForTools();

      expect(tools).toEqual([]);
    });
  });
});
