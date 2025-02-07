import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface TokenService {
  fillAmount(): Promise<void>;

  sendToken(metaAddress: any): Promise<any>;

  deleteAmount(): Promise<void>;
}
