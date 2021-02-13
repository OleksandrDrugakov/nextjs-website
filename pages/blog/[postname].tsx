import { GetStaticProps, GetStaticPaths } from "next"
import Head from "next/head"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import styles from "../../styles/BlogPost.module.css"
import { dateString } from "../../util"
import { ElementType } from "react"

export default function BlogPost({ frontmatter, markdownBody }) {
  if (!frontmatter) return <></>

  const renderers: { [nodeType: string]: ElementType<any>; } = {
    image: props =>
      /\/videos\//.test(props.src)
        ? (
          <div className="image-container">
            <video src={props.src} title={props.alt} controls muted />
            <div className="image-caption">{props.alt}</div>
          </div>
        )
        : (
          <div className="image-container">
            <img src={props.src} alt={props.alt} />
            <div className="image-caption">{props.alt}</div>
          </div>
        ),
    paragraph: "div"
  }

  return (
    <>
      <a href="/blog" className={styles.backlink}>https://luckypines.com/blog</a>
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@fumiakiy" />
        <meta name="og:title" content={frontmatter.title} />
        <meta name="twitter:title" content={frontmatter.title} />
        {
          !!frontmatter.excerpt
            ? <meta name="description" content={frontmatter.excerpt} />
            : null
        }
        {
          !!frontmatter.excerpt
            ? <meta name="og:description" content={frontmatter.excerpt} />
            : null
        }
        {
          !!frontmatter.excerpt
            ? <meta name="twitter:description" content={frontmatter.excerpt} />
            : null
        }
        {
          !!frontmatter.ogImage
            ? <meta property="og:image" content={`https://luckypines.com${frontmatter.ogImage}`} />
            : null
        }
        {
          !!frontmatter.ogImage
            ? <meta property="twitter:image" content={`https://luckypines.com${frontmatter.ogImage}`} />
            : null
        }
      </Head>
      <div className="blog">
        <article className={styles.article}>
          <h1>{frontmatter.title}</h1>
          <div className={styles.date}>{dateString(frontmatter.epoch)}</div>
          <div className={styles.body}>
            <ReactMarkdown source={markdownBody} renderers={renderers} />
          </div>
        </article>
      </div>
      <footer className={styles.footer}>
        <a href="/blog" className={styles.backlink}>https://luckypines.com/blog</a>
      </footer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { postname } = context.params

  const content = await import(`../../posts/${postname}.md`)
  const data = matter(content.default)

  return {
    props: {
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogSlugs = ((context) => {
    const keys = context.keys()
    const data = keys.map((key, index) => {
      let slug = key.replace(/^.*[\\\/]/, "").slice(0, -3)

      return slug
    })
    return data
  })(require.context("../../posts", true, /\.md$/))

  const paths = blogSlugs.map((slug) => `/blog/${slug}`)

  return {
    paths,
    fallback: false,
  }
}