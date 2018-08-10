import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user.model';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  transform(users: User[], input, type): User[] {
    if (!users) {
      return;
    }
    if (input === undefined) {
      input = '';
    }
    input = input.toString().toLowerCase();
    console.log(type);
    console.log(input);
    switch (type) {
        case SearchUserEnum.User: {
          return users.filter(u => u.firstname.toLowerCase().match(input) || u.lastname.toLowerCase().match(input)
          || u.firstname.toLowerCase().concat(' ').concat(u.lastname.toLowerCase()).match(input));
        }
        case SearchUserEnum.Object: {
          return users.filter(u => u.lending.find(o => o.name.search(input) !== -1));
        }
        case SearchUserEnum.Address: {
          return users.filter(u => u.address.toLowerCase().match(input));
        }
        case undefined: {
          return users;
        }
    }
  }

}

export enum SearchUserEnum {
  User = 'User',
  Object = 'Object',
  Address = 'Address'
}
