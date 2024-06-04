import { Button } from "../../ui/Button"

export function LinksCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Social Links.</h1>
                    <p>Add links of your socials or websites to your profile</p>
                </div>
                <div className="flex justify-between items-center self-stretch dark:border-stroke rounded-lg w-fit md:w-full">
                    <div className="flex p-3 items-center gap-10 self-stretch bg-gray-100 dark:bg-gray-900">https://</div>
                    <input className="flex items-center gap-4 p-3 py-4 flex-1 self-stretch" placeholder="example.com" />
                </div>
                <div className="flex justify-between items-center self-stretch dark:border-stroke rounded-lg w-fit md:w-full">
                    <div className="flex p-3 items-center gap-10 self-stretch bg-gray-100 dark:bg-gray-900">https://</div>
                    <input className="flex items-center gap-4 p-3 py-4 flex-1 self-stretch" placeholder="example.com" />
                </div>
                <div className="flex justify-between items-center self-stretch dark:border-stroke rounded-lg w-fit md:w-full">
                    <div className="flex p-3 items-center gap-10 self-stretch bg-gray-100 dark:bg-gray-900">https://</div>
                    <input className="flex items-center gap-4 p-3 py-4 flex-1 self-stretch" placeholder="example.com" />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between dark:border-stroke-t bg-gray-100 dark:bg-gray-900">
                <p>Maximum of 3 links. Mainstream platforms have their own icons.</p>
                <div className="flex items-center gap-3">
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}