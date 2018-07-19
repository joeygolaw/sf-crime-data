#FOLDERS & FILES
Diagramed breakdown of the purpose of each folder and file.

	[root] /
		└————— sass /
			├————— breakpoints / 											Viewport-width-specific styles.
			├————— components / 											Element-specific styles.
				├————— buttons.scss
				├————— footer.scss
				├————— forms.scss
				├————— global.scss
				├————— grid.scss
				├————— navigation.scss
				├————— page.scss												Global page structures only. Add page-specific code to corresponding SASS stylesheet nested within "pages" (below).
				└————— typography.scss

			├————— pages / 														Page-specific styles.
				├————— about.scss
				├————— help.scss
				├————— landing.scss
				├————— safety.scss
				└————— search.scss

			└─——─ tools / 														SASS-only variables.
				├————— general-animations.scs						General animation variables.
				├————— general-html-reset.scss					Removes browser styles.
				├————— general-variables.scs						General style variables.
				├————— project-animations.scss					Project-specific animations.
				└————— project-variables.scss						Project-specific variables.
