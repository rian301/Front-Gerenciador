import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolToStatus'
})
export class BollToStatusPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof (value) === 'boolean') {
      if (value)
        return 'Ativo';
      else
        return 'Inativo';
    }
    else {
      return value;
    }
  }
}
