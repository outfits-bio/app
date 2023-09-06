import ReactMarkdown from 'react-markdown'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Layout } from "~/components/Layout";
import { getPost, getSortedPostsData } from "~/utils/blog.util";

export const BlogPost = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { title, date, content } = data;

    return (
        <Layout title="Blog">
            <div className='w-full flex justify-center p-8 sm:p-12'>
                <article className='flex flex-col container gap-8 w-[800px]'>
                    <div className='flex flex-col gap-4'>
                        <h1 className='font-bold text-5xl font-clash'>{title}</h1>
                        <p className='text-secondary-text'>{date}</p>
                    </div>
                    <ReactMarkdown className='prose lg:prose-lg prose-headings:font-clash'>
                        {content}
                    </ReactMarkdown>
                </article>
            </div>
        </Layout>
    );
};

export default BlogPost;

export const getStaticPaths: GetStaticPaths = () => {
    const posts = getSortedPostsData();

    const paths = posts.map((post) => ({
        params: {
            slug: post.id
        }
    }));

    return {
        paths,
        fallback: false
    }
};

export const getStaticProps: GetStaticProps<{
    data: ReturnType<typeof getPost>
}> = async ({ params }) => {
    if (!params?.slug) {
        return { notFound: true };
    }

    const post = getPost(params.slug as string);
    return { props: { data: post } };
};