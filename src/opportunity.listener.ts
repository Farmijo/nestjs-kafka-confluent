import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OpportunityListener {
  @MessagePattern('salesforce-opportunity')
  handleSalesforceOpportunity(@Payload() message: any) {
    console.log('Message Received on salesforce-opportunity:');
    console.log(message);
  }
}
