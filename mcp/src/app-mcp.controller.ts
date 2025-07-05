import { Controller, Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { McpController, Tool } from './mcp/decorators';

@Controller()
@McpController()
export class AppMcpController {
  constructor(private readonly _appService: AppService) {}

  @Tool({
    name: 'Get app status',
    description: 'Get the status of the application',
  })
  public async getAppHealth() {
    const status = this._appService.getHello();

    return {
      content: [
        {
          type: 'text',
          text: status,
        },
      ],
    };
  }
}
