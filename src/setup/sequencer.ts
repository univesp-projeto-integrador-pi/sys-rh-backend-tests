import Sequencer from '@jest/test-sequencer';
import type { Test } from '@jest/test-result';

class CustomSequencer extends Sequencer {
  sort(tests: Test[]): Test[] {
    const order = [
      'security.test.ts',
      'auth.test.ts',
      'validation.test.ts',
      'department.test.ts',
      'candidate.test.ts',
      'jobPosition.test.ts',
      'jobApplication.test.ts',
      'errorHandling.test.ts',
      'rateLimit.test.ts',
    ];

    return tests.sort((a, b) => {
      const aName = a.path.split('/').pop() || '';
      const bName = b.path.split('/').pop() || '';
      return order.indexOf(aName) - order.indexOf(bName);
    });
  }
}

export default CustomSequencer;