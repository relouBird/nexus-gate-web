import { cn } from "@/utils/cn";
import {
  CheckCircle1,
  Close,
  Envelope1,
  InfoCircle,
  XmarkCircle,
} from "@tailgrids/icons";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { linkStyles } from "@/constants/ui/link.constant";
import { iconWrapperStyle, type ToastVariant } from "@/constants/ui/toast.constant";

type MessageType =
  | string
  | {
      title: string;
      description: string;
    };

type PropsType = {
  variant?: ToastVariant;
  undoAction?: () => void;
  onClose?: () => void;
  message: MessageType;
  children?: React.ReactNode;
  hideIcon?: boolean;
  icon?: React.ReactNode;
};

export function Toast({
  variant = "default",
  undoAction,
  onClose,
  message,
  children,
  hideIcon,
  icon,
}: PropsType) {
  return (
    <div
      className={
        cn(
          "flex max-w-112.5 min-w-96.25 items-center gap-3 rounded-lg border border-base-200 p-3 shadow-sm bg-background-100",
          typeof message === "object" && "relative items-start",
          hideIcon && "py-2",
        )
      }
    >
      {!hideIcon && (
        <div className={iconWrapperStyle({ variant })}>
          {icon || getIcon(variant)}
        </div>
      )}

      <div
        className={cn({
          "contents ": typeof message === "string",
          "ml-1": typeof message === "object" && hideIcon,
        })}
      >
        {typeof message === "object" && (
          <h4 className="mb-1.5 text-lg font-semibold text-title-50">
            {message.title}
          </h4>
        )}

        <p
          className={cn({
            "text-base text-title-50 font-medium": typeof message === "string",
            "text-sm text-text-100": typeof message === "object",
            "ml-1": typeof message === "string" && hideIcon,
          })}
        >
          {typeof message === "string" ? message : message.description}
        </p>

        {typeof message === "string" && undoAction && (
          <button
            className={linkStyles({ variant: "primary", className: "ml-auto" })}
            onClick={undoAction}
          >
            Undo
          </button>
        )}

        {children}

        <Button
          variant="ghost"
          size="xs"
          iconOnly
          onClick={onClose}
          className={cn({
            "ml-auto": !undoAction,
            "absolute top-1 right-1": typeof message === "object",
          })}
        >
          <span className="sr-only">Dismiss Toast</span>
          <Close />
        </Button>
      </div>
    </div>
  );
}

type AvatarToastProps = {
  name: string;
  description: string;
  image?: string;
  status: "none" | "online" | "offline" | "busy";
  time: string;
};

export function AvatarToast({
  name,
  description,
  image,
  status,
  time,
}: AvatarToastProps) {
  return (
    <div className="bg-background-100 relative flex min-w-89.5 items-start gap-4 rounded-lg border border-base-200 p-5 shadow-sm">
      <Avatar
        src={image}
        alt={"Image of " + name}
        status={status}
        fallback={name.charAt(0)}
        size={"lg"}
      />

      <div>
        <h4 className="text-sm font-semibold text-title-50">{name}</h4>
        <p className="text-sm text-text-100">{description}</p>

        <p className="text-primary-500 mt-2 text-xs">{time}</p>
      </div>

      <Button
        variant="ghost"
        size="xs"
        iconOnly
        className="absolute top-1 right-1"
      >
        <span className="sr-only">Dismiss Toast</span>
        <Close />
      </Button>
    </div>
  );
}

function getIcon(variant: PropsType["variant"]) {
  switch (variant) {
    case "success":
      return <CheckCircle1 />;
    case "error":
      return <XmarkCircle />;
    case "warning":
      return <InfoCircle />;
    case "info":
      return <InfoCircle />;
    case "default":
      return <Envelope1 />;
  }
}
