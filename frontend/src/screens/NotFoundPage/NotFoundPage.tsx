import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export const NotFoundPage = (): JSX.Element => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="[font-family:'Literata',Helvetica] text-7xl font-normal leading-none text-[#4a7c59]/30">
        404
      </span>
      <h1 className="mt-6 [font-family:'Literata',Helvetica] text-3xl font-normal leading-9 text-[#2e3230]">
        This route doesn't exist yet.
      </h1>
      <p className="mt-3 max-w-md [font-family:'Nunito_Sans',Helvetica] text-base font-normal leading-6 text-[#5d625d]">
        The page you're looking for may have moved or never existed. Let's get
        you back on a safe route.
      </p>
      <Link to="/" className="mt-8">
        <Button className="h-auto rounded-3xl bg-[#4a7c59] px-8 py-4 [font-family:'Nunito_Sans',Helvetica] text-base font-bold leading-6 text-white shadow-[0px_4px_20px_#2e32300f] hover:bg-[#426f50]">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
