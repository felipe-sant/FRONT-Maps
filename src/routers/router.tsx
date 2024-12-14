import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import NotFound from "../pages/notFound";
import Maps from "../pages/maps";

export default function Routers() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<Maps />} />
        <Route path="*" element={<NotFound />} />
      </Switch>
    </BrowserRouter>
  );
}