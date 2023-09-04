"""Added author to Org table

Revision ID: ded81bea700c
Revises: aed46b46668d
Create Date: 2023-09-04 13:21:48.515674

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ded81bea700c'
down_revision = 'aed46b46668d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organization', schema=None) as batch_op:
        batch_op.drop_constraint('organization_author_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'user', ['author_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('organization', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('organization_author_id_fkey', 'user', ['author_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###
