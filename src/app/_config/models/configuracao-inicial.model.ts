export class ConfiguracaoInicial {
  appName: string;
  icon: string;
  horizontal: string;
  vertical: string;
  imgUserDefault: string;

  constructor(
    appName: string,
    icon: string,
    horizontal: string,
    vertical: string,
    imgUserDefault: string
  ) {
    this.appName = appName;
    this.icon = icon;
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.imgUserDefault = imgUserDefault;
  }
}
