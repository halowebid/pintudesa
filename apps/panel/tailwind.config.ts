import { join } from "path"

export default {
  content: [
    join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"),
  ],
}
