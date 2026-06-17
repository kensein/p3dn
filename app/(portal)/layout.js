import PortalHeader from '../../components/portal/PortalHeader';
import PortalFooter from '../../components/portal/PortalFooter';

export default function PortalLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <PortalHeader />
      <main className="grow">{children}</main>
      <PortalFooter />
    </div>
  );
}
