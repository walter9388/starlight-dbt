# starlight-dbt

Beautiful, customisable, high-performance dbt docs using Starlight (Astro)

# Roadmap to 0.1.0

- [x] Translate dbt-docs build code into modern modular typescript.
- [x] work out how to do changelog / cicd npm deploy
- [x] Structure out basic plugin structure, and get basic code working so that models generate pages in dev/build (use vite virtual modules?)
- [x] Add project/database/group to sidebar as dymanic custom component.
 - [x] Add persistance between page changes (radio option doesn't change)
 - [ ] Make similar pages stick between radio option changes
 - [ ] Make it work over different dbt projects
 - [ ] update Icons
 - [ ] Test all the above
- [ ] Make `DbtPageTemplate.astro` work well.
- [ ] sort out cicd (formatting, linting, testing)
- [ ] sort out older versions of dbt manifest
- [ ] Add option to markdown config for it to be before or after dbt component.
- [ ] S3 content population
- [ ] Improve internal typing
  - [ ] redefine a lot of the manifest/catalog schema types explicitly
  - [ ] get the typing on the virtual model to work (i.e. `virtual:dbt-data`)
- [ ] Add multiple dbt projects / packages?
- [ ] Versioning (sidebar vs entire page)?
- [ ] Search
- [ ] Graph
- [ ] Theme
- [ ] Docs and examples
