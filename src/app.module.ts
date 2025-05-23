import { Module } from '@nestjs/common';
import { ContractListener } from './contract.listener';
import { OpportunityListener } from './opportunity.listener';

@Module({
  imports: [],
  controllers: [ContractListener, OpportunityListener],
  providers: [],
})
export class AppModule {}
