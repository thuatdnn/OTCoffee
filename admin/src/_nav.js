import { User } from './utils/user';

const role = User.role();
const nav = {
  items: [
    {
      name: 'Transaction',
      url: '/transaction',
      icon: 'icon-list',
    },
  ]
}
if(role == "admin" || role == "staff") nav.items.push({
  name: 'Table',
  url: '/table',
  icon: 'icon-grid',
},
{
  name: 'Product',
  url: '/product',
  icon: 'icon-cup',
})
if(role == "admin") nav.items.push({
  name: 'Staff',
  url: '/staff',
  icon: 'icon-people',
})

export default nav;
