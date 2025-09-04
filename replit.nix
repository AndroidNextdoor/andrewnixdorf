{ pkgs }:
{
  deps = [
    pkgs.python3   # serves the site
    # optional: pkgs.jq pkgs.nodejs_22
  ];
}
