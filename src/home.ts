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
      "Open the assistant from the widget at the bottom left. Choose Start from an existing database to connect your own database, or describe the pages you need.",
  });
}
