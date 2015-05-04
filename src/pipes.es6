import { Pipe, defaultPipes } from 'angular2/change_detection';

class NumberPipeFactory extends Pipe {
  supports(): boolean {
    return true;
  }

  transform(value): string {
    // TODO: Format.
    return value.toString();
  }

  create(): Pipe {
    return this;
  }
}

class DatePipeFactory extends Pipe {
  supports(obj): boolean {
    return typeof obj.getTime === 'function';
  }

  transform(value): string {
    const month = value.getMonth() + 1;
    const day = value.getDate();
    return `${month}/${day}`;
  }

  create(): Pipe {
    return this;
  }
}

export var pipes = Object.assign({}, defaultPipes, {
  number: [
    new NumberPipeFactory()
  ],
  date: [
    new DatePipeFactory()
  ]
});
