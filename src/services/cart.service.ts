import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-cart';

class CartService {
  init() {
    this._updCounters();
  }
    // Добавляем в избранное товар
  async addToFavorites(product: ProductData) {
    let favorites = (await localforage.getItem('favorites')) as ProductData[] | null;
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    favorites.push(product);
    await localforage.setItem('favorites', favorites);
    this._updCounters();
  }

      // Получаем массив избранных товаров
  async getFavorites() {
    const favorites = (await localforage.getItem('favorites')) as ProductData[] | null;
    return favorites || [];
  }

      // Проверяем если ли товар в избранном
  async isFavorite(product: ProductData) {
    const favorites = await this.getFavorites();
    return favorites.some((favProduct) => favProduct.id === product.id);
  }

    // Удаляем товар из ибранного
  async removeFromFavorites(product: ProductData) {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter((favProduct) => favProduct.id !== product.id);
    localforage.setItem('favorites', updatedFavorites);
    this._updCounters();
  }


  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(DB);
    this._updCounters();
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB, data);
    this._updCounters();
  }

  async isInCart(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const cartProducts = await this.get();
    const favorites = await this.getFavorites();
    const favoriteElement = document.querySelector('.favorit');

    const cartCount = cartProducts.length >= 10 ? '9+' : cartProducts.length;
    const favoritesCount = favorites.length >= 10 ? '9+' : favorites.length;

    if (favoritesCount === 0) {
      if (favoriteElement) {
        favoriteElement.classList.add('hidden_fav');
      }
    }
    else {
      if (favoriteElement) favoriteElement.classList.remove('hidden_fav');
    }

    //@ts-ignore
    document.querySelectorAll('.js__cart-counter').forEach(($el: HTMLElement) => {
      $el.innerText = String(cartCount || '');
    });

    //@ts-ignore
    document.querySelector('.js__favorite-counter')?.innerHTML = String(favoritesCount || '');
  }

}

export const cartService = new CartService();
