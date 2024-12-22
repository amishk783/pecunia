import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export const GernalSection = () => {
  const { user, loading } = useAuth();
  const userAvtarUrl = user?.user_metadata.avatar_url as string;
  console.log("🚀 ~ GernalSection ~ userAvtarUrl:", userAvtarUrl);
  return (
    <section className="flex flex-col space-y-6">
      <div className="xl:w-2/3 pt-4 px-4 py-6 rounded-lg bg-theme-primary  ">
        <div className="flex flex-col gap-2 ">
          <div className="flex space-x-40 border-b py-4 ">
            <div className="flex flex-col">
              <h5 className="text-lg font-semibold">Your Photo</h5>
              <p>This will be displayed as your profile</p>
            </div>
            <div className="flex items-center  ">
              <div className="flex items-center justify-center rounded-full relative border-2 border-theme-themeText overflow-hidden w-20 h-20">
                {!loading ? (
                  <img className=" absolute " src={`${userAvtarUrl}`}></img>
                ) : (
                  <Loader2
                    size={14}
                    className=" absolute w-10 h-10 animate-spin"
                  />
                )}
              </div>

              <Button variant="ghost">Delete</Button>
              <Button variant="ghost">Update</Button>
            </div>
          </div>
          <div className="flex justify-between border-b py-4 h-full items-center ">
            <div className="flex flex-col">
              <h5 className="text-lg font-semibold">Your Name</h5>
            </div>
            <div className="flex h-full items-center gap-2  ">
              <input
                placeholder="First Name"
                className=" py-5 bg-slate-100 w-full h-4 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
              ></input>
              <input
                placeholder="Last Name"
                className="py-2 md:py-5 bg-slate-100 w-full h-1 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
              ></input>
              <Button className="">Update</Button>
            </div>
          </div>
          <div className="flex space-x-12 border-b py-4 h-full items-center ">
            <div className="flex flex-col w-1/3 ">
              <h5 className="text-lg font-semibold">Currency</h5>
            </div>
            <div className="flex w-1/2  h-full items-center gap-2  ">
              <input
                placeholder="First Name"
                className=" py-5 bg-slate-100 w-full h-4 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
              ></input>
            </div>
          </div>
        </div>
      </div>
      {/* usage section */}
      <div className=" md:w-2/3 bg-theme-primary px-4 py-6 rounded-lg">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Your usage</h2>

          <div className="flex flex-col gap-2 border-b pb-6 ">
            <h2 className="text-md font-medium">Transaction Enteries</h2>
            <div className="flex flex-col gap-1">
              <p className="">10 of 100</p>

              <div className=" max-w-80  h-3 relative rounded-xl">
                <div className="bg-black absolute h-3 w-full rounded-lg "></div>
                <div
                  style={{ width: `${""}%` }}
                  className=" bg-secondary  absolute z-10 h-3 rounded-lg  "
                ></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 pb-6 border-b">
            <h2 className="text-md font-medium"> SmartScan Status</h2>
            <div className="flex flex-col gap-1">
              <p className="">10 of 100</p>

              <div className=" max-w-80  h-3 relative rounded-xl">
                <div className="bg-black absolute h-3 w-full rounded-lg "></div>
                <div
                  style={{ width: `${"transactionWidth"}%` }}
                  className=" bg-white absolute z-10 h-3 rounded-lg  "
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-2/3 bg-theme-primary  px-4 py-3 rounded-lg border-red-500 border">
        <div className=" flex flex-col gap-2">
          <h2 className="text-lg font-semibold border-b py-4">
            Delete Account
          </h2>
          <p className=" py-4 text-slate-700/70">
            Permanently delete your account and all its associated data, this
            action cannot be undone.
          </p>
          <div className=" w-full flex items-center justify-end">
            <Button className="px-4" variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
