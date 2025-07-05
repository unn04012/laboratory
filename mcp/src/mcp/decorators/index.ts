import { SetMetadata } from '@nestjs/common';
import {
  MCP_CONTROLLER_METADATA,
  MCP_TOOL_METADATA,
} from '../constants/mcp.constants';
import { MCP_RESOURCE_METADATA } from '../constants/mcp.constants';
import { McpResourceOptions, McpToolOptions } from '../types/mcp.types';

/**
 * MCP Controller 마커 데코레이터
 */
export function McpController(): ClassDecorator {
  return SetMetadata(MCP_CONTROLLER_METADATA, true);
}

/**
 * MCP Resource 데코레이터
 * @param options 리소스 설정 옵션
 */
export function Resource(options: McpResourceOptions): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const existingResources =
      Reflect.getMetadata(MCP_RESOURCE_METADATA, target.constructor) || [];

    const resourceMetadata = {
      ...options,
      methodName: propertyKey as string,
      target: target.constructor,
    };

    existingResources.push(resourceMetadata);
    Reflect.defineMetadata(
      MCP_RESOURCE_METADATA,
      existingResources,
      target.constructor,
    );

    return descriptor;
  };
}

/**
 * MCP Tool 데코레이터
 * @param options 툴 설정 옵션
 */
export function Tool(options: McpToolOptions): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const existingTools =
      Reflect.getMetadata(MCP_TOOL_METADATA, target.constructor) || [];

    const toolMetadata = {
      ...options,
      methodName: propertyKey as string,
      target: target.constructor,
    };

    existingTools.push(toolMetadata);
    Reflect.defineMetadata(
      MCP_TOOL_METADATA,
      existingTools,
      target.constructor,
    );

    return descriptor;
  };
}
