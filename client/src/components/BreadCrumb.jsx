import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useBreadCrumbStore from "@/state/breadcrumb";

const BreadCrumb = () => {
  const breadcrumbs = useBreadCrumbStore((state) => state.breadcrumb);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i) => (
          <div key={breadcrumb.path} className="flex items-center gap-1">
            <BreadcrumbItem>
              {i === breadcrumbs.length - 1 ? (
                <BreadcrumbPage className="text-secondary-100">
                  {breadcrumb.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={breadcrumb.path}
                  className="text-secondary-100"
                >
                  {breadcrumb.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i !== breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className={"text-secondary-100"} />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
