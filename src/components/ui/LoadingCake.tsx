import { publicPath } from "../../lib/utils";

const LoadingCake: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => {
  if (hidden) return null;
  return (
    <img
      title="Loading"
      alt="Loading"
      width={100}
      src={publicPath("images/cake.gif")}
    />
  );
};

export const LoadingCakeFullSize: React.FC = () => {
  return (
    <>
      <div className="fixed left-0 right-0 flex w-full h-full justify-center items-center">
        <LoadingCake />
      </div>
    </>
  );
};

export default LoadingCake;
