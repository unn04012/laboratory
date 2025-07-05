import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppMcpController } from './app-mcp.controller';
import { McpTransportType } from '@rekog/mcp-nest';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [
    // McpModule.forRoot({
    //   name: 'mcp-server',
    //   version: '1.0.0',
    //   transport: McpTransportType.STDIO,
    // }),
    McpModule,
  ],
  controllers: [AppController, AppMcpController],
  providers: [AppService],
})
export class AppModule {}
