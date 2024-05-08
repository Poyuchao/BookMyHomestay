import { httpLocal } from "../http-common";
import { favoriteService } from "../services/LikedService";

export default class Favorite {
  #uid;
  #favorites = new Map();

  constructor(uid) {
    this.#uid = uid;
  }

  async loadFavorite() {
    let isLogged = localStorage.getItem("authToken");

    if (!isLogged) {
      return;
    }

    let favoriteList = await favoriteService.getAll().catch((err) => {
      return [];
    });

    for (let item of favoriteList) {
      let homeObj = new HomestayObj(
        item.id,
        item.title,
        item.desc,
        item.location,
        item.rating,
        item.price_per_month,
        item.amenities,
        item.vegetarian_friendly,
        item.images
      );

      this.#favorites.set(homeObj.hid, homeObj);
    }
  }

  isFavorite(hid) {
    return this.#favorites.has(hid);
  }

  // add or remove homestay from favorite list
  toggleFavorite(homestay) {
    console.log("[favoriteList.js] toggleFavorite()", homestay);
    if (this.#favorites.has(homestay.hid)) {
      this.#favorites.delete(homestay.hid);
      favoriteService.delete(homestay.hid);
    } else {
      this.#favorites.set(homestay.hid, homestay);
      favoriteService.add(homestay.hid);
    }
  }

  populateDataToObj(homestay) {
    if (this.#favorites.has(homestay.hid)) {
      this.#favorites.delete(homestay.hid);

      httpLocal.post("liked/delete", {
        homestay_id: homestay.hid,
      });
    } else {
      this.#favorites.set(homestay.hid, homestay);
      httpLocal.post("liked/add", {
        homestay_id: homestay.hid,
      });
    }
  }

  getFavoriteSize() {
    return this.#favorites.size;
  }

  isFavoriteEmpty() {
    return this.#favorites.size === 0;
  }

  getFavoritesList() {
    return Array.from(this.#favorites.values());
  }
}

export class HomestayObj {
  #hid;
  #title;
  #desc;
  #location;
  #rating;
  #price_per_month;
  #amenities;
  #vegetarian_friendly;
  #images;

  constructor(
    hid,
    title,
    desc,
    location,
    rating,
    price_per_month,
    amenities,
    vegetarian_friendly,
    images
  ) {
    this.#hid = hid;
    this.#title = title;
    this.#desc = desc;
    this.#location = location;
    this.#rating = rating;
    this.#price_per_month = price_per_month;
    this.#amenities = amenities;
    this.#vegetarian_friendly = vegetarian_friendly;
    this.#images = images;
  }

  //convert the instance with its private properties into a plain JavaScript object
  //with the same property values, but publicly accessible.
  serialize() {
    return {
      hid: this.#hid,
      title: this.#title,
      desc: this.#desc,
      location: this.#location,
      rating: this.#rating,
      price_per_month: this.#price_per_month,
      amenities: this.#amenities,
      vegetarian_friendly: this.#vegetarian_friendly,
      images: this.#images,
    };
  }

  get hid() {
    return this.#hid;
  }

  get title() {
    return this.#title;
  }

  get desc() {
    return this.#desc;
  }

  get location() {
    return this.#location;
  }

  get rating() {
    return this.#rating;
  }

  get price_per_month() {
    return this.#price_per_month;
  }

  get amenities() {
    return this.#amenities;
  }

  get vegetarian_friendly() {
    return this.#vegetarian_friendly;
  }
  get images() {
    return this.#images;
  }

  //  objsuccess(){
  //     return "obj success created";
  //  }
}
