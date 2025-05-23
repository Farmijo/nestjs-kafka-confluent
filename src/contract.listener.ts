import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ContractListener {
  @EventPattern('salesforce-contract')
  handleSalesforceContract(@Payload() message: any) {
    console.log('Message Received on salesforce-contract:');
    console.log(message);
  }
}
