import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import SpinnerPreview from "@/components/spinner-preview";
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-16">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Code&nbsp;</span>
        <span className={title({ color: "violet" })}>smarter,&nbsp;</span>
        <br />
        <span className={title()}>Prepare like a pro.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Blogs, challenges, and animated spinners to sharpen your skills.
        </div>
      </div>

      {/* Spinner animation */}
      {/* <SpinnerPreview /> */}

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/blogs"
        >
          Explore Blogs
        </Link>
        <Link
          className={buttonStyles({
            variant: "bordered",
            radius: "full",
          })}
          href="/interview-prep"
        >
          Start Interview Prep
        </Link>
        <Link
          isExternal
          className={buttonStyles({
            variant: "flat",
            radius: "full",
          })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={18} />
          GitHub
        </Link>
      </div>
    </section>
  );
}
