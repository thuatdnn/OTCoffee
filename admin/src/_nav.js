import { User } from './utils/user';

const role = User.role();
const nav = {
  items: [
    {
      name: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Table',
      url: '/admin/table',
      icon: 'icon-grid',
    },
    {
      name: 'Product',
      url: '/admin/product',
      icon: 'icon-cup',
    },
    {
      name: 'Transaction',
      url: '/admin/transaction',
      icon: 'icon-list',
    },
  ]
}
if(role == "admin") nav.items.push({
  name: 'Staff',
  url: '/admin/staff',
  icon: 'icon-people',
})

export default nav;
