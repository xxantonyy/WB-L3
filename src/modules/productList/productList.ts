import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './productList.tpl.html';
import { ProductData } from 'types';
import { Product } from '../product/product';
import { Component } from '../component';
import { sendEvent } from '../../utils/helpers';

export class ProductList extends Component {
  view: View;
  products: ProductData[];

  constructor() {
    super(html);
    this.products = [];
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  update(products: ProductData[]) {
    this.products = products;
    this.render();
  }
  getProducts() {
    return this.products;
  }

  render() {
    this.view.root.innerHTML = '';
    sendEvent('route', { url: window.location.href });
    console.log(`Переход по rout-у ! ${window.location.href}`);

    // Когда получаем карточку выполняем эту функцию в которой делаем фетч и получаем секретный ключ и отправляем форму с ним 

    const sendFormWithKey = (product: ProductData) => {
      const eventType = product.log ? 'viewCardPromo' : 'viewCard';
      fetch(`/api/getProductSecretKey?id=${product.id}`)
        .then((res) => res.json())
        .then((secretKey) => {
          sendEvent(eventType, { ...product, secretKey })
            .then((success) => {
              if (success) {
                console.log('Event sent successfully.');
              } else {
                console.log('Failed to send event.');
              }
            })
            .catch((error) => {
              console.log('Error sending event:', error);
            });
        })
        .catch((error) => {
          console.log('Error fetching secret key:', error);
        });
    }

    // Ставим обсервер который следит и проверяем какие карточки находятся во viewporte


    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !(entry.target as HTMLElement).dataset.viewed) {
          (entry.target as HTMLElement).dataset.viewed = 'true';
          const product = this.products.find(product => {
            const elemId = entry.target.getAttribute('href')?.split('/product?id=', -1)[1];
            if (elemId) {
              return +elemId === product.id
            }

            return false
          })
          if (product) {
            sendFormWithKey(product);
          }
         }
      });
    });

    this.products.forEach((product) => {
      const productComp = new Product(product);
      productComp.render();
      productComp.attach(this.view.root);

      const card = document.querySelectorAll('a.product');
      card.forEach((item) => {
        observer.observe(item);
      })
    });
  }
}
