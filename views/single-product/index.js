"use client";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel.css";
import Image from "next/image";
import cart from "@/public/images/cart.png";
import sliders from "@/public/images/sliders.png";
import share from "@/public/images/share.png";
import { useParams } from "next/navigation";
import http from "@/api/interseptors";
import Link from "next/link";
import Basket from "@/service/basket.service";
import Comment from "@/service/comment.service";
import avatar from "@/public/images/avatar.png";

const SingleProductPage = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { id } = useParams();

  const getData = async () => {
    try {
      const { data } = await http.get(`/product/${id}`);
      setProduct(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBasket = async (id) => {
    try {
      const product = { productId: id, quantity: 1 };
      const response = await Basket.basketPost(product);
      console.log("Basket Response:", response);
      if (response.data === true) {
        console.log("Product added to basket successfully.");
      } else {
        console.error("Failed to add product to basket:", response);
      }
    } catch (error) {
      if (error.message === "EOF") {
        console.error(
          "Server returned an empty response. Please try again later."
        );
      } else {
        console.error("Error adding product to basket:", error);
      }
    }
  };

  const getComments = async (id) => {
    try {
      const response = await Comment.get(id);
      console.log(response);
      setComments(response?.data.Comment || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = {
        productId: id,
        text: newComment,
      };
      const response = await Comment.post(commentData);
      console.log(response);
      setNewComment("");
      getComments(id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    getComments(id);
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const { product_name, description, made_in, count, cost, image_url } =
    product;

  return (
    <div className="p-4 md:p-8 bg-custom-gray">
      <div className="container">
        <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-10 rounded-lg">
          <div className="w-full max-w-[600px] flex flex-col justify-center items-center bg-white rounded-xl">
            <Carousel
              showArrows={true}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              useKeyboardArrows={true}
              autoPlay={true}
              interval={3000}
              transitionTime={500}
              className="w-full lg:w-[500px] rounded-xl overflow-hidden shadow-lg"
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute left-0 z-10 p-2 text-white bg-black rounded-full opacity-50 hover:opacity-100"
                    style={{ top: "calc(50% - 15px)" }}
                  >
                    &lt;
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute right-0 z-10 p-2 text-white bg-black rounded-full opacity-50 hover:opacity-100"
                    style={{ top: "calc(50% - 15px)" }}
                  >
                    &gt;
                  </button>
                )
              }
            >
              {image_url && image_url.length > 0 ? (
                image_url.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={product_name}
                      width={500}
                      height={500}
                      className="object-contain w-full h-[400px]"
                    />
                  </div>
                ))
              ) : (
                <div className="relative">
                  <Image
                    src={productImage}
                    alt="Fallback product image"
                    width={370}
                    height={370}
                  />
                </div>
              )}
            </Carousel>
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {image_url &&
                image_url.length > 0 &&
                image_url.map((url, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 bg-white p-2 border-2 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${index}`}
                      className="object-cover w-full h-full"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full max-w-[600px] p-8 bg-white rounded-lg">
            <h1 className="text-2xl font-bold">{product_name}</h1>
            <p className="mt-2 text-gray-700">{description}</p>
            <p className="mt-2 text-gray-700">В наличии: {count} шт.</p>
            <p className="mt-2 text-gray-700">
              Страна производитель: {made_in}
            </p>
            <p className="mt-4 text-2xl font-bold">{cost} UZS / 1 шт.</p>
            <div className="flex gap-4 mt-4">
              <Link
                href="/basket"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                onClick={() => handleBasket(product.product_id)}
              >
                <Image src={cart} alt="cart" width={20} height={20} />
                Корзина
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400 text-yellow-400 rounded-md hover:border-yellow-500 hover:text-yellow-500">
                <Image src={sliders} alt="slider" width={20} height={20} />
                Сравнить
              </button>
            </div>
            <div className="mt-8">
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-md hover:border-gray-400">
                <Image src={share} alt="share" width={20} height={20} />
                Поделиться
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Описание</h2>
            <h4 className="text-lg font-semibold">{product.product_name}</h4>
            <p className="mt-2 mb-6 text-orange-400">
              Oписание: {product.description}
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Цена:</h3>
                <p className="text-lg text-orange-400">{product.cost} so'm</p>
              </li>
              <li className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Цвета:</h3>
                <p className="text-orange-400">{product.color}</p>
              </li>
              <li className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Возраст:</h3>
                <p className="text-orange-400">
                  {product.age_min} - {product.age_max} лет
                </p>
              </li>
              <li className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Категория:</h3>
                <p className="text-orange-400">{product.category}</p>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Отзывы</h2>
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Image
                      src={avatar}
                      alt="User avatar"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-bold">{comment.OwnerID}</p>
                      <p className="text-sm text-gray-600">{}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {comment.Message}
                      </p>
                      <div className="flex mt-2 text-yellow-500">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span className="text-gray-400">★</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Нет отзывов.</p>
              )}
            </div>
            <a href="#" className="block mt-4 text-yellow-500">
              Все отзывы
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-lg font-bold mb-4">Оставить отзыв</h2>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Ваш комментарий"
              ></textarea>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
