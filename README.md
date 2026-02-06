# starlight-dbt

Beautiful, customisable, high-performance dbt docs using Starlight (Astro)

# Roadmap to 0.1.0

- [x] Translate dbt-docs build code into modern modular typescript.
- [x] work out how to do changelog / cicd npm deploy
- [x] Structure out basic plugin structure, and get basic code working so that models generate pages in dev/build (use vite virtual modules?)
- [x] Add project/database/group to sidebar as dymanic custom component.
  - [x] Add persistance between page changes (radio option doesn't change)
  - [x] Make similar pages stick between radio option changes
  - [x] Make it work over different dbt projects
  - [x] update Icons / general style
  - [x] Test all the above
- [x] Refactor to use content layer
  - [x] Move file loading to manager, and away from the json parsing
  - [x] Make basic config work
  - [x] Make shared config tell loader which projects exist in sidebar to load from cache
  - [x] Make sure all other things pass through (e.g. badges, attrs, etc.) in config
- [x] Add multiple dbt projects / packages?
- [ ] Improve internal typing
  - [ ] zod
  - [ ] redefine a lot of the manifest/catalog schema types explicitly
  - [ ] make catalog optional
  - [ ] get the typing on the virtual model to work (i.e. `virtual:dbt-data`)
- [ ] Make `DbtPageTemplate.astro` work well.
- [ ] improve test coverage on lib (unit testing)
- [ ] sort out cicd (formatting, linting, testing)
- [ ] sort out older versions of dbt manifest
- [ ] Add option to markdown config for it to be before or after dbt component.
- [ ] Add Markdown file generation inside dbt projects, as well as overrides / pretext
- [ ] Versioning (sidebar vs entire page)?
- [ ] Search (is native ok?)
- [ ] Basic graph clone
- [ ] Themes
- [ ] Docs and examples

# Future Roadmap

- [ ] External content population
  - [ ] S3
  - [ ] dbt-cloud
- [ ] Better graph
- [ ] Better search
- [ ] Add run_results.json dbt artifact options / visualisations
