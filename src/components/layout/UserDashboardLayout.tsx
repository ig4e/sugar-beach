import {
  Cog6ToothIcon,
  HomeModernIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuItem from "../base/MenuItem";
import Layout from "./Layout";
import AuthGaurd from "../base/AuthGaurd";
import { type ReactNode } from "react";
const accountOptions = [
  { name: "my-account", href: "/@me", Icon: Cog6ToothIcon },
  { name: "my-orders", href: "/@me/orders", Icon: ShoppingBagIcon },
  { name: "my-addresses", href: "/@me/addresses", Icon: HomeModernIcon },
] as const;

import useTranslation from "next-translate/useTranslation";
import { NavLink, createStyles } from "@mantine/core";

const useNavLinkStyles = createStyles((theme) => ({
  root: {
    borderRadius: theme.radius.md,
    ":hover": {
      backgroundColor: theme.colors["gray"][1],
    },
  },
}));

function UserDashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { classes: navLinkClasses } = useNavLinkStyles();

  return (
    <Layout>
      <AuthGaurd>
        <div className="my-8 gap-8 md:grid md:[grid-template-columns:_clamp(15rem,20%,25em)_1fr;]">
          <div className="hidden h-fit flex-col gap-2 rounded-md bg-white p-2 drop-shadow md:flex">
            {accountOptions.map((option) => {
              return (
                // <Link href={option.href} key={option.name}>
                //   <MenuItem
                //     name={t(`Auth.routes.${option.name}`)}
                //     Icon={option.Icon}
                //     variant="ghost"
                //     size="md"
                //     active={router.pathname === option.href}
                //   ></MenuItem>
                // </Link>
                <NavLink
                  classNames={navLinkClasses}
                  component={Link}
                  href={option.href}
                  key={option.name}
                  icon={<option.Icon className="h-5 w-5" />}
                  active={router.pathname === option.href}
                  label={t(`Auth.routes.${option.name}`)}
                  rightSection={<ChevronRightIcon className="h-4 w-4" />}
                  variant="filled"
                ></NavLink>
              );
            })}
          </div>
          <div className="w-full">{children}</div>
        </div>
      </AuthGaurd>
    </Layout>
  );
}

export default UserDashboardLayout;
