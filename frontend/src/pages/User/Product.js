import React, { useState, useEffect, useRef } from "react";
import { BASE_URL } from "../../core/constants";
import styled from "styled-components";
import cardBg from "../../assets/pic/productDetailsBg.jpeg";
import { useParams } from "react-router-dom";
import { ProductsApi } from "../../api/Products";
import Imagegallery from "../../components/User/ImageGallery";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useDispatch } from "react-redux";
import { addToCart, decreaseCart } from "../../redux/reducers/CartSlice";
import { toast } from "react-toastify";
import Counter from "../../components/User/Cart/Counter";
import { v4 as uuidv4 } from "uuid";
const Card = styled("div")``;
const CardBody = styled("div")`
   display: flex;
   justify-content: center;
`;
const Image = styled("img")`
   height: 450px;
   width: 370px;
   border-radius: 10px;
   margin-top: 20px;
   transition: width 2s ease-out;
   &:hover {
      width: 400px;
   }
`;
const CardContent = styled("div")`
   height: 320px;
   width: 500px;
   background:#ffe680;
   margin-top: 50px;
   border-radius: 10px 0 0 10px;
`;
const Cardtext = styled("div")``;
const CardName = styled("h1")`
   color: #00004d;
   margin-right: 40px;
`;
const CardP = styled("p")`
   color: #00004d;
   margin-right: 40px;
   font-size: 23px;
`;
const CardButton = styled("button")`
   background: #ff5d8f;
   border: none;
   padding: 5px 10px;
   cursor: pointer;
   margin: 20px 10px;
`;
const ImageListStyled = styled(ImageList)`
   margin: 10px;
   width: 100px;
   height: 300px;
`;
const ImageListItemStyled = styled(ImageListItem)`
   margin: 10px;
`;
const Gallery = styled("div")`
   position: "reletive";
   top: 50%;
   left: 50%;
   transform: translate(-30%, -100%);
`;
const StyledDiv = styled("div")`
   display: flex;
   justify-content: flex-end;
   margin-left: 20px;
   align-items: center;
`;

export default function ProductDetails() {
   let { id } = useParams();
   const dispatch = useDispatch();
   const [productDetail, setProductDetail] = useState({});
   const [images, setImages] = useState([]);
   const [show, setShow] = useState(false);
   const [count, setCount] = useState(1);
   const [isAddedToCart, setIsAddedToCart] = useState(false);

   const descRef = useRef();
   const getDetails = async () => {
      const res = await ProductsApi.get(id);
      setProductDetail(res.data);
      const gallery = res.data?.images;
      setImages(gallery);
      descRef.current.innerHTML = res.data?.description;
   };
   const handleShow = () => {
      setShow(!show);
   };
   useEffect(() => {
      getDetails();
   }, [id, count]);

   const handleAddToCart = () => {
      if (count > productDetail.inventory) {
         toast.error(
            `از این کالا تنها ${productDetail.inventory} عدد در انبار موجود میباشد!`
         );
      }

      dispatch(addToCart({ productDetail, count }));
      setIsAddedToCart(true);
   };
   const handleDecrement = (product) => {
      setCount(product[1]);
   };
   const handleIncrement = (product) => {
      setCount(product[1]);
   };
   return (
      <>
         <Card
            style={{ zIndex: 5000, background: show ? "rgba(1,1,1,0.5)" : "" }}
         >
            <CardBody>
               <ImageListStyled onClick={handleShow} cols={1} rowHeight={100}>
                  {images?.map((item) => (
                     <div >
                        <ImageListItemStyled key={uuidv4()}>
                           <img
                              src={BASE_URL + `${item}`}
                              srcSet={
                                 BASE_URL +
                                 `${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                              }
                              alt={item}
                              loading="lazy"
                           />
                        </ImageListItemStyled>
                     </div>
                  ))}
               </ImageListStyled>
               <Image src={BASE_URL + productDetail.image} />
               <CardContent>
                  <Cardtext>
                     <CardName>{productDetail.name}</CardName>
                     <CardP>{"دسته بندی: پوشاک - شلوار "}</CardP>
                     <CardP>
                        {` قیمت: 
                        ${productDetail.price?.toLocaleString("fa")} تومان`}
                     </CardP>
                  </Cardtext>
                  <StyledDiv>
                     <Counter
                        inventory={productDetail.inventory}
                        data={{ productDetail, count }}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                     />
                     {productDetail.inventory ? (
                        <CardButton
                           disabled={isAddedToCart}
                           onClick={handleAddToCart}
                        >
                           افزودن به سبد خرید
                        </CardButton>
                     ) : (
                        <CardButton disabled>موجود نیست</CardButton>
                     )}
                  </StyledDiv>
               </CardContent>
            </CardBody>
            <CardP ref={descRef} style={{ color: "black" }}></CardP>
         </Card>

         {show && (
            <Gallery>
               {" "}
               <Imagegallery images={images} />
            </Gallery>
         )}
      </>
   );
}
