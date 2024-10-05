export default function VersionNumber() {
  return process.env.APP_VERSION ? (
    <div className="border bottom-3 fixed px-3 right-4 rounded-full bg-white shadow">
      <p className="text-balance text-xs leading-loose text-muted-foreground text-right font-mono">
        Opus v{process.env.APP_VERSION}
      </p>
    </div>
  ) : (
    ""
  );
}
