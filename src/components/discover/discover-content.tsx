'use client'

import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { PostType } from 'database'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PiBookmarkSimpleBold, PiCamera, PiClockBold, PiFadersHorizontal, PiFireBold, PiHammer, PiHeart, PiNewspaper, PiOption, PiSealCheck, PiSidebar } from 'react-icons/pi'
import { PostModal } from '../modals/post-modal'
import { Button } from '../ui/Button'
import { CategoryButton } from './category-button'
import { Post } from './post/post'
import { RegisterBanner } from './register-banner'
import { Avatar } from '../ui/Avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { BaseModal, BaseModalContent, BaseModalHeader, BaseModalTitle, BaseModalTrigger } from '../modals/base-modal'
import { PopularProfiles } from './popular-profiles'

export function DiscoverContent({ initialPosts }: { initialPosts: any; }) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()

    const [activePostTypes, setActivePostTypes] = useState<PostType[]>(["OUTFIT"])
    const [isFilterOpen, setIsFilterOpen] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeCategory, setActiveCategory] = useState<'latest' | 'popular'>(
        params.get('category') === 'popular' ? 'popular' : 'latest'
    )

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('isSidebarOpen')
            setIsSidebarOpen(saved !== null ? JSON.parse(saved) : true)
            setIsLoaded(true)
        }
    }, [])

    useEffect(() => {
        const category = params.get('category')
        setActiveCategory(category === 'popular' ? 'popular' : 'latest')
    }, [params])

    const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage, refetch } =
        api.post.getLatestPosts.useInfiniteQuery(
            {
                category: activeCategory,
                types: activePostTypes.length > 0 ? activePostTypes : undefined,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                initialData: { pages: [initialPosts], pageParams: [undefined] },
            }
        )

    useEffect(() => {
        void refetch()
    }, [activeCategory, activePostTypes, refetch])

    const handleChangePostType = (type: PostType) => {
        if (activePostTypes.includes(type)) {
            setActivePostTypes(activePostTypes.filter((t) => t !== type))
        } else {
            setActivePostTypes([...activePostTypes, type])
        }
    }

    const handleChangeCategory = (category: 'latest' | 'popular') => {
        const currentParams = new URLSearchParams(Array.from(params.entries()))
        currentParams.set('category', category)
        router.push(`${pathname}?${currentParams.toString()}`)
        setActiveCategory(category)
    }

    const posts = data?.pages.flatMap((page) => page.posts)

    const observer = useRef<IntersectionObserver>()
    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isFetchingNextPage || isFetching) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
                    void fetchNextPage()
                }
            })
            if (node) observer.current.observe(node)
        },
        [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage]
    )

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                window.scrollBy(0, -100)
            } else if (event.key === 'ArrowDown') {
                window.scrollBy(0, 100)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const toggleSidebar = () => {
        const newState = !isSidebarOpen
        setIsSidebarOpen(newState)
        localStorage.setItem('isSidebarOpen', JSON.stringify(newState))
    }

    return (
        <div className="flex h-full">
            <PostModal />
            <AnimatePresence>
                {isLoaded && isSidebarOpen && (
                    <motion.section
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-col hidden h-full p-4 bg-white border-r dark:bg-black border-stroke md:flex"
                    >
                        <div className="flex gap-1 mb-2">
                            <motion.button
                                onClick={() => handleChangeCategory('latest')}
                                className={`${activeCategory === 'latest' ? 'text-inherit border dark:border-stroke' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-xl`}
                                type="button"
                                aria-label="Latest"
                                animate={{
                                    scale: activeCategory === 'latest' ? 1.05 : 1,
                                    backgroundColor: activeCategory === 'latest' ? 'var(--color-stroke)' : 'transparent'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <PiClockBold className="text-2xl" />
                                <p>Latest</p>
                            </motion.button>

                            <motion.button
                                onClick={() => handleChangeCategory('popular')}
                                className={`${activeCategory === 'popular' ? 'text-inherit border dark:border-stroke' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-xl`}
                                type="button"
                                aria-label="Popular Button"
                                animate={{
                                    scale: activeCategory === 'popular' ? 1.05 : 1,
                                    backgroundColor: activeCategory === 'popular' ? 'var(--color-stroke)' : 'transparent'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <PiFireBold className="text-2xl" />
                                <p>Popular</p>
                            </motion.button>
                        </div>

                        {/* Filter */}
                        <div className="flex flex-col w-full">
                            <div className="relative">
                                <Button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex ${isFilterOpen ? 'rounded-b-none' : ''}`}
                                    variant={'outline-ghost'}
                                >
                                    <span>Filter</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 transform ${isFilterOpen ? 'rotate-180  mb-1' : 'rotate-0  mt-1'}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3.586L3.707 9.879a1 1 0 101.414 1.414L10 6.414l4.879 4.879a1 1 0 101.414-1.414L10 3.586z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Button>
                                {isFilterOpen && (
                                    <div className="w-full bg-white dark:bg-black border border-stroke border-t-0 rounded-xl rounded-t-none">
                                        <div className="flex flex-col gap-2 p-4 max-h-[50vh] overflow-y-auto overflow-x-hidden">
                                            {Object.values(PostType).map((type) => (
                                                <CategoryButton
                                                    key={type}
                                                    activePostTypes={activePostTypes}
                                                    handleChangePostType={handleChangePostType}
                                                    type={type}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-grow"></div>
                        <div className='flex gap-3 justify-between'>
                            {session && (
                                <Link href={'/wishlist'}>
                                    <Button
                                        variant={'ghost'}
                                        iconLeft={<PiBookmarkSimpleBold />}
                                        className="justify-start"
                                    >
                                        Wishlist
                                    </Button>
                                </Link>
                            )}
                            <div>
                                <Button
                                    variant={'ghost'}
                                    iconLeft={<PiSidebar />}
                                    shape={'square'}
                                    onClick={toggleSidebar}
                                />
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {isLoaded && !isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden md:block absolute left-4 bottom-4 z-10"
                >
                    <Button
                        variant={'ghost'}
                        iconRight={<PiSidebar />}
                        className="shadow-md border border-stroke"
                        shape={'circle'}
                        onClick={toggleSidebar}
                    />
                </motion.div>
            )}

            <section className="relative flex flex-col items-center gap-4 px-1 pt-1 grow">
                {/* Post Type */}
                <div className="fixed z-10 flex max-w-[14rem] w-full gap-1 top-[0.25rem] md:hidden">
                    <button
                        onClick={() => handleChangeCategory('latest')}
                        className={cn(
                            'max-w-fit py-1.5 font-medium font-clash flex gap-2 items-center justify-center transition-colors duration-150 rounded-xl',
                            activeCategory === 'latest'
                                ? 'text-inherit border dark:border-stroke w-full px-3'
                                : 'text-secondary-text px-3'
                        )}
                        type="button"
                    >
                        <PiClockBold className="text-2xl" />
                        <p
                            className={cn(
                                activeCategory === 'latest' ? 'block' : 'hidden sm:block'
                            )}
                        >
                            Latest
                        </p>
                    </button>

                    <button
                        onClick={() => handleChangeCategory('popular')}
                        className={cn(
                            'max-w-fit py-1.5 font-medium font-clash flex gap-2 items-center justify-center transition-colors duration-150 rounded-xl',
                            activeCategory === 'popular'
                                ? 'text-inherit border dark:border-stroke w-full px-3'
                                : 'text-secondary-text px-3'
                        )}
                        type="button"
                    >
                        <PiFireBold className="text-2xl" />
                        <p
                            className={cn(
                                activeCategory === 'popular' ? 'block' : 'hidden sm:block'
                            )}
                        >
                            Popular
                        </p>
                    </button>

                    <BaseModal>
                        <BaseModalTrigger>
                            <button className='max-w-fit py-1.5 font-medium font-clash flex gap-2 items-center justify-center transition-colors duration-150 rounded-xl'>
                                <PiFadersHorizontal className='text-2xl' />
                            </button>
                        </BaseModalTrigger>
                        <BaseModalContent>
                            <BaseModalHeader>
                                <BaseModalTitle>Filter</BaseModalTitle>
                            </BaseModalHeader>
                            <div className='flex flex-col gap-2'>
                                {Object.values(PostType).map((type) => (
                                    <CategoryButton
                                        key={type}
                                        activePostTypes={activePostTypes}
                                        handleChangePostType={handleChangePostType}
                                        type={type}
                                    />
                                ))}
                            </div>
                        </BaseModalContent>
                    </BaseModal>
                </div>

                {/* Flex for Posts and Popular Profiles */}
                <div className="flex w-full justify-between overflow-hidden">
                    {/* Posts */}
                    <div className="flex flex-col items-center w-full gap-3 pb-[69px] overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth md:pb-0 md:first:mt-4">
                        {posts
                            ? posts.map((post, index) => {
                                return (
                                    <div
                                        ref={posts.length === index + 1 ? lastElementRef : null}
                                        key={post.id}
                                        className="flex justify-center w-full"
                                    >
                                        <Post post={post} priority={index < 3} />
                                    </div>
                                )
                            })
                            : null}
                    </div>



                    {/* Popular Profiles */}
                    <div className="hidden xl:flex w-80 mr-8">
                        <PopularProfiles />
                    </div>
                </div>

                <RegisterBanner />
            </section>
        </div>
    )
}