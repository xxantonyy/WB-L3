import { catalogComp } from './modules/catalog/catalog';
import { notFoundComp } from './modules/notFound/notFound';
import { homepageComp } from './modules/homepage/homepage';
import { productDetailComp } from './modules/productDetail/productDetail';
import { checkoutComp } from './modules/checkout/checkout';
import { favoriteComp } from './modules/favorite/favorite';
import { sendEvent } from './utils/helpers';

const ROUTES = {
  '/': homepageComp,
  '/catalog': catalogComp,
  '/product': productDetailComp,
  '/checkout': checkoutComp,
  '/favorite': favoriteComp,
};

export default class Router {
  $appRoot: HTMLElement;

  constructor() {
    // @ts-ignore
    this.$appRoot = document.querySelector('.js__root');

    window.addEventListener('load', this.route.bind(this));
    window.addEventListener('hashchange', this.route.bind(this));
  }

  route(e: any) {
    e.preventDefault();

    // @ts-ignore
    const component = ROUTES[window.location.pathname] || notFoundComp;

    sendEvent('route', { url: window.location.href });
    console.log(`Переход по routу! - ${window.location.href}`);

    component.attach(this.$appRoot);
    component.render();
  }
}
