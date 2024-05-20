import { Image, type ImageProps } from "@mantine/core";
import {
  LazyLoadImage,
  type LazyLoadImageProps,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// create polymorphic component
interface Props extends LazyLoadImageProps, ImageProps {}

export default function LazyImage(props: Props): React.ReactElement {
  const { src } = props;

  return (
    <Image
      {...props}
      component={LazyLoadImage}
      src={src ?? "/fallback-image.png"}
      effect="blur"
      onError={(e) => {
        const elm = e.target as HTMLImageElement;
        elm.onerror = null;
        elm.src = "/fallback-image.png";
      }}
    />
  );
}
