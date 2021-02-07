/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import {
	BlockEditBox,
	BlockEditErrorBoundary,
	__experimentalBlockDragging as BlockDragging,
} from '@quillforms/block-editor';
import { __experimentalDroppable as Droppable } from '@quillforms/builder-components';

/**
 * Wordpress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies.
 */
import classNames from 'classnames';

const BlockDragIndexLine = () => {
	return <div className="block-drag-index-line"></div>;
};

const DropArea = ( props ) => {
	const { areaToHide, currentPanel, targetIndex, isDragging } = props;
	const { blockTypes, formBlocks } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
		};
	} );

	return (
		<div
			className="builder-core-drop-area"
			style={ {
				maxWidth: areaToHide
					? '60%'
					: currentPanel
					? 'calc(55% - 300px)'
					: '55%',
			} }
		>
			<Droppable
				droppableId="DROP_AREA"
				renderClone={ ( provided, _snapshot, rubric ) => {
					const item = { ...formBlocks[ rubric.source.index ] };
					const block = blockTypes[ item.type ];
					return (
						<div
							{ ...provided.draggableProps }
							{ ...provided.dragHandleProps }
							ref={ provided.innerRef }
							style={ {
								...provided.draggableProps.style,
								height: undefined,
								padding: 12,
							} }
						>
							<BlockDragging item={ item } block={ block } />
						</div>
					);
				} }
			>
				{ ( provided, snapshot ) => (
					<div
						className={ classNames(
							'builder-core-drop-area__container',
							{
								'disable-hover-highlight':
									isDragging || snapshot.isDraggingOver,
							}
						) }
						{ ...provided.droppableProps }
						ref={ provided.innerRef }
						isDraggingOver={ snapshot.isDraggingOver }
					>
						{ formBlocks?.length > 0 &&
							formBlocks.map( ( item, index ) => {
								const block = blockTypes[ item.type ];
								return (
									<>
										{ index === targetIndex && (
											<BlockDragIndexLine />
										) }
										<BlockEditErrorBoundary key={ item.id }>
											<BlockEditBox
												index={ index }
												item={ { ...item } }
												block={ block }
											/>
										</BlockEditErrorBoundary>
									</>
								);
							} ) }
						{ targetIndex === formBlocks.length && (
							<BlockDragIndexLine />
						) }
						{ provided.placeholder }
					</div>
				) }
			</Droppable>
		</div>
	);
};
export default DropArea;
