import { Banner } from "@antelopejs/interface-dms/base";
import {
  PageController,
  pagesCategory,
  RegisterPage,
} from "@antelopejs/interface-dms/page";

@RegisterPage()
export class PageHome extends PageController("home", {
  displayName: "Home",
  icon: "i-ph-house",
  category: pagesCategory,
  order: 0,
  description: "Connect a database or build your own pages",
}) {
  static start = Banner({
    tone: "primary",
    icon: "i-ph-plugs-connected",
    title: "Start here",
    description:
      "Open the Builder (hammer icon, top right). Choose Database to connect your own database, or Page to build a page.",
  });
}
