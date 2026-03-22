import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  enqueueTaskActivity() {
    return { queued: false, message: 'BullMQ pending in phase 2' };
  }
}
