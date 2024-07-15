import { Link } from "react-router-dom";
import { Footer, FooterLinkGroup } from "flowbite-react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
export default function FooterCom()
{
  return (
    <Footer className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm-flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 px-1 py-2 rounded-lg bg-clip-text text-transparent font-bold ">
                Blog<span>X</span>
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div className="flex gap-2 flex-col">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link>100 JS Projects</Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link>Alin's Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="flex gap-2 flex-col">
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link>Github</Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link>Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="flex gap-2 flex-col">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link>Privacy Policy</Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link>Terms &amp; Conditions </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between px-6">
          <Footer.Copyright by="Alin's Blog" year={new Date().getFullYear()} />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center pb-4">
            <Footer.Icon icon={FaSquareXTwitter} />
            <Footer.Icon icon={FaGithub} />
            <Footer.Icon icon={SiDiscord} />
            <Footer.Icon icon={FaSquareXTwitter} />
            <Footer.Icon icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
