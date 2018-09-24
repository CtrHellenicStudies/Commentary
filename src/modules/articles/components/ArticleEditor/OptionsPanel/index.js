import React from 'react';
import { Field } from 'redux-form';

import { maxLength } from '../../../../../lib/formHelpers';

import './OptionsPanel.css';


const maxLength2000 = maxLength(2000);


const OptionsPanel = ({ showOptionView, categoryType, toggleDeleteModal }) => (
	<div className="optionsPanel">
		<div className="articleEditorForm">
			{categoryType && categoryType.length ?
				<div>
					<div className="optionsPanelInner">
						{categoryType === 'archive' ?
							<div className="categoryDescription">
								<p>
  								An archive post is a historical original, unedited text (or audio piece) of African American culture.
								</p>
							</div>
      			: categoryType === 'spotlight' ?
	<div className="categoryDescription">
		<p>A spotlight post is . . . (insert completed description of Spotlight post)</p>
	</div>
      			: categoryType === 'theme' ?
	<div className="categoryDescription">
		<p>A theme post is . . . (insert completed description of Theme post)</p>
	</div>
      			: '' }

						<div className="articleEditorFormInputOuter">
							{categoryType === 'theme' ?
								<ul>
									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Description</label>
												<Field
													className="articleMetaInput"
													name="description"
													type="text"
													component="input"
    										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
												</p>
											</li>
										</ul>
									</li>
								</ul>
						 :
								<ul>
									{categoryType === 'spotlight' ?
										<li>
											<ul className="articleMetaContainer">
												<li className="articleMetaInputContainer">
													<label className="articleMetaField">Summary</label>
													<Field
														className="articleMetaInput"
														name="summary"
														type="text"
														component="input"
														validate={[maxLength2000]}
  											/>
												</li>
												<li className="articleMetaDescriptionContainer">
													<p>
  												Include a summary for Spotlight article.
													</p>
												</li>
											</ul>
										</li>
  							: '' }

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Author(s)</label>
												<Field
													className="articleMetaInput"
													name="author"
													type="text"
													component="input"
													validate={[maxLength2000]}
    										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The person who originally produced this content, or the person it is being attributed to. Use commas to add multiple authors.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Editor(s)</label>
												<Field
													className="articleMetaInput"
													name="editor"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The person who edited or built upon the original. Use commas to add multiple editors.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Collector(s)</label>
												<Field
													className="articleMetaInput"
													name="collector"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The person that helped preserve the content. Use commas to add multiple creators.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Publication</label>
												<Field
													className="articleMetaInput"
													name="publication"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The newspaper, book, magazine, record, or other place where this originally appeared to the public. Use commas to add multiple publications.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Place</label>
												<Field
													className="articleMetaInput"
													name="places"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The location where this content was originally produced. Be as specific as is known. Use commas to add multiple places.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Date</label>
												<Field
													className="articleMetaInput"
													name="date"
													type="date"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											The date when this content was produced. Be as specific as possible, but it’s okay to use approximate dates if the exact creation date isn’t known. Use commas to add multiple dates, if needed.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Themes</label>
												<Field
													className="articleMetaInput"
													name="themes"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											You can add this content to a theme. For example adding a post to the “Flying Africans” theme, would make that post show up on the list of posts under that theme. Use commas to add the post to multiple themes.
												</p>
											</li>
										</ul>
									</li>

									<li>
										<ul className="articleMetaContainer">
											<li className="articleMetaInputContainer">
												<label className="articleMetaField">Characters</label>
												<Field
													className="articleMetaInput"
													name="characters"
													type="text"
													component="input"
													validate={[maxLength2000]}
  										/>
											</li>
											<li className="articleMetaDescriptionContainer">
												<p>
  											List the characters that appear in this post. This post will then appear in the results where users search for those characters.
												</p>
											</li>
										</ul>
									</li>
								</ul>
							}
						</div>
					</div>
					<div className="deleteContainer">
						<button
							className="deleteButton"
							onClick={toggleDeleteModal}
							type="button"
						>
							<img src="/images/baseline-delete-24px.svg" alt="delete icon"/>
							Delete post
						</button>
					</div>
				</div>
			: '' }
		</div>
	</div>
);

export default OptionsPanel;
