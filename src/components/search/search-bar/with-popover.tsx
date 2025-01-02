"use client";

import { api } from "@/trpc/react";
import { showSearch } from "@/utils/nav-options.util";
import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  PiHammer,
  PiMagnifyingGlass,
  PiMagnifyingGlassBold,
  PiSealCheck,
  PiSpinnerGap,
} from "react-icons/pi";
import { Avatar } from "../../ui/Avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: searchData,
    isFetching,
    refetch,
  } = api.user.searchProfiles.useQuery(
    { username: input },
    {
      enabled: false,
    },
  );

  const request = debounce(async () => {
    void refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    void request();
  }, []);

  useEffect(() => {
    setInput("");
    setIsOpen(false);
  }, [pathname]);

  const show = pathname && showSearch(pathname);

  if (!show) return null;

  return (
    <motion.div
      className="relative items-center font-clash font-medium xl:flex"
      initial={{ width: "48px" }}
      animate={{ width: isOpen ? "400px" : "48px" }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Input
              autoComplete="off"
              id="link"
              type="text"
              placeholder="Search for users"
              className="pl-4 py-2 h-12 w-full border rounded-xl border-stroke text-secondary-text dark:bg-black focus:outline-none"
              onChange={(e) => {
                setInput(e.target.value);
                debounceRequest();
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  router.push(`/search?username=${input}`);
                }
              }}
              value={input}
            />

          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`absolute right-0 flex items-center justify-center h-12 w-12 hover:bg-hover disabled:hover:bg-transparent ${isOpen ? 'rounded-r-xl' : 'rounded-xl'}`}
        disabled={isOpen && !input}
        onClick={() => {
          if (isOpen && input) {
            router.push(`/search?username=${input}`);
          } else {
            setIsOpen(!isOpen);
          }
        }}
      >
        {isFetching ? (
          <PiSpinnerGap className="text-secondary-text w-6 h-6 animate-spin" />
        ) : (
          <PiMagnifyingGlass className="text-secondary-text w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 w-full"
          >
            <Popover className={"relative"}>
              {() => (
                <>
                  <Transition
                    show={input.length > 0}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel>
                      <div className="relative border border-stroke rounded-xl p-4 bg-white dark:bg-black w-full flex flex-col gap-2 shadow-lg">
                        <Link
                          href={`/search?username=${input}`}
                          className="flex items-center rounded-lg p-2 bg-stroke border border-stroke text-secondary-text w-full text-left"
                        >
                          <PiMagnifyingGlassBold className="text-xl mr-2" />
                          <p>Search for &quot;{input}&quot;</p>
                        </Link>

                        {searchData?.users
                          ? searchData.users.slice(0, 4).map((user) => (
                            <Link
                              href={`/${user.username}`}
                              key={user.id}
                              className="flex items-center rounded-md p-2 hover:bg-hover w-full text-left border border-stroke"
                            >
                              <Avatar
                                image={user.image}
                                id={user.id}
                                username={user.username}
                                size={"xs"}
                                className="mr-2"
                              />
                              <p>{user.username}</p>
                              {user.admin ? (
                                <PiHammer className="ml-1 text-primary" />
                              ) : user.verified ? (
                                <PiSealCheck className="ml-1 text-primary" />
                              ) : null}
                            </Link>
                          ))
                          : null}
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              )}
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
