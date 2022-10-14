# Puppeteer Script Action

This action enables to write a script using puppeteer in a Github Actions workflow.

This action is inspired from `@actions/github-scripts` action.

## Inputs

### script

**Required** The script to run.

This will be the body of the async function to execute.

The function receives `browser` argument which is an instance of `puppeteer.Browser`.

## Outputs

### result

The JSON-encoded return value of the script.

## Usage

```
- id: get-title
  uses: maku693/actions-puppeteer-script@v0
  with:
    script: |
      const page = await browser.newPage();
      await page.goto('https://example.com');
      const title = await page.$eval('title', el => el.textContent);
      return title;
- run: echo '${{ steps.get-title.outputs.result }}' # This will puts `"Example Domain"`
```
