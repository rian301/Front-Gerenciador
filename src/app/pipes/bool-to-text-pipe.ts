import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolToText'
})
export class BollToTextPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof (value) === 'boolean') {
      if (value)
        return 'Sim';
      else
        return 'Não';
    }
    else {
      return value;
    }
  }
}
