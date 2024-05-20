import { Badge } from "antd";
import type { RibbonProps } from "antd/es/badge/Ribbon";

interface Props {
  show?: boolean;
}

export default function Ribbon(props: RibbonProps & Props): React.ReactNode {
  const { children, show = true } = props;

  if (!show) {
    return children;
  }

  return <Badge.Ribbon {...props}>{children}</Badge.Ribbon>;
}
