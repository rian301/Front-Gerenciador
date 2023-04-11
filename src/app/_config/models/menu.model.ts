export class Menu {
  name: string;
  icon: string;
  expanded: boolean;
  active: boolean = false;
  url: string;
  isExternal: boolean;
  submenus: Menu[];
  cssClass: string;

  constructor(
    name: string = "", 
    icon: string = "", 
    url: string = "", 
    expanded: boolean = false, 
    isExternal: boolean = false, 
    submenus: Menu[] = [], cssClass="material-icons") 
    {
      this.name = name;
      this.icon = icon;
      this.url = url;
      this.expanded = expanded;
      this.isExternal = isExternal;
      this.submenus = submenus;
      this.cssClass = cssClass;
    }
}
